program App;

uses
  SysUtils;

type
  generic THelloGeneric<T> = class
  public
    constructor Create;
    destructor Destroy; override;
    procedure Hello(const Name: T);
  end;
  THello = specialize THelloGeneric<String>;

constructor THelloGeneric.Create;
begin
  inherited;
  Writeln(Self.ClassName, '.Create');
end;

destructor THelloGeneric.Destroy;
begin
  Writeln(Self.ClassName, '.Destroy');
  inherited;
end;

procedure THelloGeneric.Hello(const Name: T);
begin
  Writeln('Hello, ', Name, '!');
end;

var
  Hello: THello;

begin
  Hello := THello.Create;
  try
    Hello.Hello('WASM');
  finally
    Hello.Free;
  end;
end.
